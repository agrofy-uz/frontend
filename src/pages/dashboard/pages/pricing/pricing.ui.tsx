import { useEffect, useMemo, useCallback } from 'react';
import {
  Badge,
  Box,
  Button as MantineButton,
  Flex,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { getAuthMe, mapAuthMeToUser } from '@/shared/api';
import {
  HiCheckCircle,
  HiLightningBolt,
  HiOutlineXCircle,
  HiShieldCheck,
  HiSparkles,
} from 'react-icons/hi';
import { usePricingModalStore } from '@/shared/store/pricingModalStore';
import { useAuthStore, useAuthStoreHydrated } from '@/shared/store/authStore';
import { resolveActivePricingPlanId } from '@/shared/lib/premiumTier';
import { createTelegramLinkClickHandler } from '@/shared/lib/telegramNavigation';
import {
  getTelegramHelpBotLink,
  getTelegramPremiumBotLink,
} from '@/shared/ui/login-modal/login-modal.const';
import { COLOR_MAP, PLANS, type Feature, type Plan } from './pricing.const';
import styles from './pricing.module.css';

/* ------------------------------------------------------------------ */
/*  Feature row                                                          */
/* ------------------------------------------------------------------ */
function FeatureRow({ text, included }: Feature) {
  return (
    <List.Item
      icon={
        <ThemeIcon
          size={18}
          radius="xl"
          variant="transparent"
          color={included ? 'green' : 'gray'}
          style={{ marginTop: 1 }}
        >
          {included ? (
            <HiCheckCircle size={18} style={{ color: '#22c55e' }} />
          ) : (
            <HiOutlineXCircle size={18} style={{ color: '#cbd5e1' }} />
          )}
        </ThemeIcon>
      }
    >
      <Text
        size="sm"
        c={included ? undefined : 'dimmed'}
        style={{ textDecoration: included ? 'none' : 'line-through' }}
      >
        {text}
      </Text>
    </List.Item>
  );
}

/* ------------------------------------------------------------------ */
/*  Plan card                                                            */
/* ------------------------------------------------------------------ */
const TELEGRAM_PREMIUM_LINK = getTelegramPremiumBotLink();
const onTelegramPremiumClick = createTelegramLinkClickHandler();

function PlanCard({
  plan,
  current,
}: {
  plan: Plan;
  current: boolean;
}) {
  const c = COLOR_MAP[plan.color];
  const isFree = plan.id === 'free';
  const ctaLabel = current ? 'Hozirgi tarif' : plan.cta;

  return (
    <Paper
      radius="xl"
      p="xl"
      style={{
        background: plan.gradient,
        border: current
          ? '2px solid var(--mantine-color-green-filled)'
          : plan.highlight
            ? `2px solid ${c.ring}`
            : '1px solid var(--mantine-color-default-border)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: current
          ? '0 4px 20px rgba(34, 197, 94, 0.15)'
          : plan.highlight
            ? '0 8px 32px rgba(59,130,246,0.10)'
            : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {current && (
        <Badge
          pos="absolute"
          top={12}
          right={12}
          variant="filled"
          color="green"
          radius="md"
          size="sm"
          style={{ zIndex: 2, fontWeight: 700 }}
        >
          Hozirgi
        </Badge>
      )}

      {plan.badge && (
        <Badge
          pos="absolute"
          top={-12}
          left="50%"
          style={{
            transform: 'translateX(-50%)',
            background: c.badge,
            color: '#fff',
            fontWeight: 700,
            fontSize: 12,
            padding: '3px 14px',
            borderRadius: 999,
            letterSpacing: 0.3,
          }}
        >
          {plan.badge}
        </Badge>
      )}

      {/* Header */}
      <Flex align="center" gap="sm" mb="xs" pr={current ? 72 : 0}>
        <ThemeIcon
          size={38}
          radius="xl"
          variant="light"
          color={plan.color === 'gray' ? 'gray' : plan.color}
          style={{ background: `${c.ring}80`, flexShrink: 0 }}
        >
          <span style={{ color: c.icon }}>{plan.icon}</span>
        </ThemeIcon>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text fw={700} fz={18} lh={1.2} lineClamp={2}>
            {plan.name}
          </Text>
          {plan.period && (
            <Text size="xs" c="dimmed">
              {plan.period}
            </Text>
          )}
        </Box>
      </Flex>

      {/* Price */}
      <Box mb="xs">
        <Text
          fw={800}
          fz={isFree ? 28 : 20}
          c={isFree ? 'dimmed' : undefined}
          lh={1.1}
        >
          {plan.price}
        </Text>
      </Box>

      {/* Slogan */}
      <Text size="sm" c="dimmed" mb="lg" mih={36}>
        {plan.slogan}
      </Text>

      {/* Features */}
      <List spacing="xs" style={{ flex: 1, marginBottom: 0 }}>
        {plan.features.map((f) => (
          <FeatureRow key={f.text} {...f} />
        ))}
      </List>

      {/* CTA — barcha kartalarda bir xil balandlik, bir chiziqda */}
      <Box mt="auto" pt="lg" style={{ flexShrink: 0 }}>
        {isFree ? (
          <Box
            ta="center"
            className={`${styles.freeCta} ${
              current ? styles.freeCtaCurrent : styles.freeCtaInactive
            }`}
          >
            <Text
              size="sm"
              fw={600}
              c={current ? 'green.7' : 'dimmed'}
              style={
                current
                  ? undefined
                  : { color: 'var(--mantine-color-dimmed)' }
              }
            >
              {ctaLabel}
            </Text>
          </Box>
        ) : (
          <MantineButton
            component="a"
            href={current ? undefined : TELEGRAM_PREMIUM_LINK}
            fullWidth
            radius="lg"
            disabled={current}
            variant={current ? 'light' : 'filled'}
            color={
              plan.color === 'green'
                ? 'green'
                : plan.color === 'blue'
                  ? 'blue'
                  : 'violet'
            }
            classNames={{
              root: [
                styles.planCta,
                current && plan.color === 'green' ? styles.planCtaGreen : '',
                current && plan.color === 'blue' ? styles.planCtaBlue : '',
                current && plan.color === 'violet' ? styles.planCtaViolet : '',
              ]
                .filter(Boolean)
                .join(' '),
            }}
            onClick={current ? undefined : onTelegramPremiumClick}
            styles={
              current
                ? undefined
                : {
                    root: {
                      boxShadow: `0 4px 14px -3px ${c.icon}55`,
                    },
                  }
            }
          >
            {ctaLabel}
          </MantineButton>
        )}
      </Box>
    </Paper>
  );
}

/* ------------------------------------------------------------------ */
/*  USP badges under header                                              */
/* ------------------------------------------------------------------ */
function UspsRow() {
  const items = [
    {
      icon: <HiShieldCheck size={16} />,
      text: 'Istalgan vaqt bekor qilish',
    },
    { icon: <HiLightningBolt size={16} />, text: 'Darhol faollashtirish' },
    {
      icon: <HiSparkles size={16} />,
      text: 'AI bilan agro-biznesingizni o\u02BBstiring',
    },
  ];
  return (
    <Flex wrap="wrap" justify="center" gap="md" mb={40}>
      {items.map((i) => (
        <Flex
          key={i.text}
          align="center"
          gap={6}
          px="md"
          py={6}
          style={{
            borderRadius: 999,
            background: 'light-dark(#f1f5f9, rgba(255,255,255,0.06))',
            border: '1px solid var(--mantine-color-default-border)',
          }}
        >
          <Box c="green">{i.icon}</Box>
          <Text size="xs" fw={500}>
            {i.text}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

/* ------------------------------------------------------------------ */
/*  Main view                                                            */
/* ------------------------------------------------------------------ */
export function PricingView() {
  const opened = usePricingModalStore((s) => s.opened);
  const hydrated = useAuthStoreHydrated();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateUser = useAuthStore((s) => s.updateUser);
  const isMobile = useMediaQuery('(max-width: 900px)');

  useEffect(() => {
    if (!opened || !hydrated || !isAuthenticated || !accessToken) return;

    let cancelled = false;

    const syncMe = async () => {
      try {
        const me = await getAuthMe();
        if (!cancelled) updateUser(mapAuthMeToUser(me));
      } catch {
        /* store dagi ma'lumot qoladi */
      }
    };

    void syncMe();

    return () => {
      cancelled = true;
    };
  }, [opened, hydrated, isAuthenticated, accessToken, updateUser]);

  const currentTier = resolveActivePricingPlanId(user);

  const visiblePlans = useMemo(
    () => (isMobile ? PLANS.filter((plan) => plan.id !== 'free') : PLANS),
    [isMobile],
  );

  const helpBotLink = useMemo(() => getTelegramHelpBotLink(), []);
  const onHelpLinkClick = useCallback(createTelegramLinkClickHandler(), []);

  return (
    <Box
      maw={1200}
      mx="auto"
      px={{ base: 0, sm: 'md' }}
      style={{ boxSizing: 'border-box' }}
    >
      <Stack gap="md">
        {/* Hero text */}
        <Stack align="center" gap={8} mb="md">
          <Badge
            size="lg"
            variant="light"
            color="green"
            radius="xl"
            leftSection={<HiSparkles size={14} />}
          >
            Agrofy Premium
          </Badge>
          <Title
            order={1}
            ta="center"
            fz={{ base: 26, sm: 36 }}
            fw={800}
            lh={1.15}
          >
            O'z biznesingizni keyingi bosqichga olib chiqing
          </Title>
          <Text ta="center" c="dimmed" maw={560} fz="md">
            Agro AI, marketplace va xizmatlar - bir platformada. Tarifingizni
            tanlang va imkoniyatlarni to'liq oching.
          </Text>
        </Stack>

        <UspsRow />

        {/* Cards grid */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(auto-fill, minmax(280px, 1fr))'
              : 'repeat(4, 1fr)',
            gap: 20,
            alignItems: 'stretch',
          }}
        >
          {visiblePlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              current={plan.id === currentTier}
            />
          ))}
        </Box>

      {/* Sahifa eng pasti */}
      <Flex
        align="center"
        justify="center"
        gap="xs"
        pt="xl"
        pb="md"
        wrap="wrap"
      >
        <HiShieldCheck size={16} color="#22c55e" style={{ flexShrink: 0 }} />
        <Text size="xs" c="dimmed" ta="center" maw={520}>
          To'lovlar xavfsiz. Istalgan vaqt bekor qilish mumkin. Savol bo'lsa -{' '}
          <Text
            component="a"
            href={helpBotLink}
            size="xs"
            c="green"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={onHelpLinkClick}
          >
            biz bilan bog'laning
          </Text>
          .
        </Text>
      </Flex>
      </Stack>
    </Box>
  );
}
